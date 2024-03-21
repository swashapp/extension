import { UnsplashImage } from "@/types/api/unsplash.type";
import { ImageRecord } from "@/types/image.type";
import { Logger } from "@/utils/log.util";

import { BaseDatabase } from "../base/database.service";
import { ImageTables } from "../data/database-tables";

export class ImageManager extends BaseDatabase {
  private static instance: ImageManager;

  private UNSPLASH_API_URL =
    "https://d34s39bh8oxiy5.cloudfront.net/photos/random";
  private IMAGE_COUNT = 20;
  private CACHE_THRESHOLD = 3;

  private constructor() {
    super({
      name: "UnsplashImagesDB",
      version: 1,
      tables: ImageTables,
    });
  }

  public static async getInstance(): Promise<ImageManager> {
    if (!this.instance) {
      this.instance = new ImageManager();
      await this.instance.init();
    }
    return this.instance;
  }

  public async fetchAndStoreImages(): Promise<void> {
    try {
      const response = await fetch(
        `${this.UNSPLASH_API_URL}?count=${this.IMAGE_COUNT}`,
      );

      if (!response.ok) throw new Error("Error fetching images from Unsplash");

      const data: UnsplashImage[] = await response.json();
      const imageRecords: ImageRecord[] = await Promise.all(
        data.map(async (img) => {
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
      Logger.info(`${imageRecords.length} new images fetched and stored.`);
    } catch (error) {
      Logger.error("Error in fetchAndStoreImages:", error);
    }
  }

  public async getImageForDisplay(): Promise<ImageRecord | undefined> {
    try {
      const images: ImageRecord[] = await this.connection.select({
        from: "images",
      });

      if (images.length === 0) {
        await this.fetchAndStoreImages();
        return;
      }

      const image = images[0];
      await this.removeImage(image.url);

      if (images.length - 1 < this.CACHE_THRESHOLD) {
        this.fetchAndStoreImages().then();
      }

      return image;
    } catch (error) {
      Logger.error("Error in getImageForDisplay:", error);
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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching Blob for image: ${url}`);
    }
    return await response.blob();
  }

  private async saveImages(images: ImageRecord[]): Promise<void> {
    try {
      await this.connection.insert({
        into: "images",
        values: images,
      });
      Logger.info(`${images.length} images saved.`);
    } catch (err) {
      Logger.error("Error saving images:", err);
    }
  }

  private async removeImage(url: string): Promise<void> {
    try {
      await this.connection.remove({
        from: "images",
        where: { url },
      });
      Logger.info(`Image removed: ${url}`);
    } catch (error) {
      Logger.error("Error removing image:", error);
    }
  }
}
