import { BaseDatabase } from "@/core/base/database.service";
import { ImageTables } from "@/core/data/database-tables";
import { ConfigurationManager } from "@/core/managers/configuration.manager";
import { UnsplashImage } from "@/types/api/unsplash.type";
import { ImageRecord } from "@/types/image.type";

export class ImageManager extends BaseDatabase {
  private static instance: ImageManager;

  private constructor(private configs: ConfigurationManager) {
    super({
      name: "UnsplashImagesDB",
      version: 1,
      tables: ImageTables,
    });
  }

  public static async getInstance(
    configs: ConfigurationManager,
  ): Promise<ImageManager> {
    if (!ImageManager.instance) {
      ImageManager.instance = new ImageManager(configs);
      await ImageManager.instance.init();
    }
    return ImageManager.instance;
  }

  public async fetchAndStoreImages(): Promise<void> {
    const { endpoint, count } = this.configs.get("unsplash");

    try {
      this.logger.debug("Start fetching images from Unsplash");
      const response = await fetch(`${endpoint}?count=${count}`);
      if (!response.ok) {
        this.logger.error("Failed to fetch images from Unsplash");
        throw new Error("Error fetching images from Unsplash");
      }
      const data: UnsplashImage[] = await response.json();
      this.logger.debug(`Fetched ${data.length} images from Unsplash`);
      const imageRecords: ImageRecord[] = await Promise.all(
        data.map(async (img) => {
          this.logger.debug("Processing an image record");
          const blob = await this.fetchImageBlob(img.urls.regular);
          const base64data = await this.blobToBase64(blob);
          return {
            url: img.urls.regular,
            blob: base64data as string,
            copyright: {
              user: img.user.name,
              profile: img.user.links.html,
              link: img.links.html,
            },
          };
        }),
      );
      await this.saveImages(imageRecords);
      this.logger.info(`Fetched and stored ${imageRecords.length} new images`);
    } catch (error) {
      this.logger.error("Error fetching and storing images", error);
    }
  }

  public async getImageForDisplay(): Promise<ImageRecord | undefined> {
    const { threshold } = this.configs.get("unsplash");
    try {
      const images: ImageRecord[] = await this.connection.select({
        from: "images",
      });
      if (images.length === 0) {
        this.logger.debug("No images found in database, fetching new images");
        await this.fetchAndStoreImages();
        return;
      }
      const image = images[0];
      this.logger.debug("Image selected for display");
      await this.removeImage(image.url);
      if (images.length - 1 < threshold) {
        this.logger.debug(
          "Image count below threshold, triggering background fetch",
        );
        this.fetchAndStoreImages().then();
      }
      return image;
    } catch (error) {
      this.logger.error("Error getting image for display", error);
      return;
    }
  }

  private blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  private async fetchImageBlob(url: string): Promise<Blob> {
    this.logger.debug("Fetching image blob");
    const response = await fetch(url);
    if (!response.ok) {
      this.logger.error(`Failed to fetch blob for image: ${url}`);
      throw new Error(`Error fetching Blob for image: ${url}`);
    }
    this.logger.debug("Image blob fetched successfully");
    return await response.blob();
  }

  private async saveImages(images: ImageRecord[]): Promise<void> {
    try {
      await this.connection.insert({
        into: "images",
        values: images,
      });
      this.logger.info(`${images.length} images saved`);
    } catch (error) {
      this.logger.error("Error saving images", error);
    }
  }

  private async removeImage(url: string): Promise<void> {
    try {
      await this.connection.remove({
        from: "images",
        where: { url },
      });
      this.logger.info(`Image removed: ${url}`);
    } catch (error) {
      this.logger.error("Error removing image", error);
    }
  }
}
