import { BaseDatabase } from "@/core/base/database.service";
import { ImageTables } from "@/core/data/database-tables";
import { ConfigurationManager } from "@/core/managers/configuration.manager";
import { UnsplashImage } from "@/types/api/unsplash.type";
import { ImageRecord } from "@/types/image.type";

export class ImageManager extends BaseDatabase {
  private static instance: ImageManager;
  private inMemoryImages: ImageRecord[] = [];

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

  public async fetchAndStoreImages(fresh: boolean = false): Promise<void> {
    const { endpoint, image } = this.configs.get("unsplash");

    const url = new URL(endpoint);
    if (fresh) url.searchParams.set("count", "1");

    try {
      this.logger.debug("Start fetching images from Unsplash");
      const response = await fetch(url.toString());
      if (!response.ok) {
        this.logger.error("Failed to fetch images from Unsplash");
        throw new Error("Error fetching images from Unsplash");
      }
      const data: UnsplashImage[] = await response.json();
      this.logger.debug(`Fetched ${data.length} images from Unsplash`);

      const results = await Promise.allSettled(
        data.map(async (img) => {
          this.logger.debug("Processing an image record");
          const url = new URL(img.urls.raw);
          url.search = new URLSearchParams(image).toString();
          const blob = await this.fetchImageBlob(url.toString());
          const base64data = await this.blobToBase64(blob);
          return this.saveImage({
            url: url.toString(),
            blob: base64data as string,
            copyright: {
              user: img.user.name,
              profile: img.user.links.html,
              link: img.links.html,
            },
          });
        }),
      );

      const records = results.filter((result) => result.status === "fulfilled");
      if (records.length === 0)
        this.logger.error("No images were successfully fetched and stored");
      else this.logger.info(`Fetched and stored ${records.length} new images`);
    } catch (error) {
      this.logger.error("Error fetching and storing images", error);
    }
  }

  public async getImageForDisplay(): Promise<ImageRecord | undefined> {
    const { threshold } = this.configs.get("unsplash");

    if (this.inMemoryImages.length === 0) {
      await this.loadToMemory(threshold);

      if (this.inMemoryImages.length === 0) {
        this.logger.debug("No images found in database, fetching new images");
        await this.fetchAndStoreImages(true);
        await this.loadToMemory(threshold);
      }
    }

    const image = this.inMemoryImages.shift();
    if (!image) return;

    this.logger.debug("Image selected for display");
    this.removeImage(image.url)
      .then(async () => {
        try {
          if ((await this.getCount()) < threshold) {
            this.logger.debug(
              "Image count below threshold, triggering background fetch",
            );
            await this.fetchAndStoreImages();
          }
          if (this.inMemoryImages.length < Math.floor(threshold / 2))
            await this.loadToMemory(threshold);
        } catch (error) {
          this.logger.error("Error fetching images", error);
        }
      })
      .catch((err) => this.logger.error("Error removing image", err));

    return image;
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
    return response.blob();
  }

  private async saveImage(image: ImageRecord): Promise<void> {
    try {
      await this.connection.insert({
        into: "images",
        values: [image],
      });
      this.logger.info(`Image saved: ${image.url}`);
    } catch (error) {
      this.logger.error("Error saving image", error);
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

  private async getCount(): Promise<number> {
    return this.connection.count({
      from: "images",
    });
  }

  private async loadToMemory(limit: number): Promise<void> {
    this.inMemoryImages = await this.connection.select<ImageRecord>({
      from: "images",
      limit,
    });
  }
}
