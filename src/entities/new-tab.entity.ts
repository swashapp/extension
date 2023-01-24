import { NewTab } from '../types/storage/new-tab.type';

import { Entity } from './entity';

export class NewTabEntity extends Entity<NewTab> {
  private static instance: NewTabEntity;

  public static async getInstance(): Promise<NewTabEntity> {
    if (!this.instance) {
      this.instance = new NewTabEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('newTab');
  }

  protected async init(): Promise<void> {
    await this.create({
      status: false,
      background: 'rgb(36, 36, 36)',
      searchEngine: {
        name: 'Google',
        url: 'https://www.google.com/search',
        params: 'q',
        logo: '/static/images/logos/google.png',
      },
      topSites: false,
      sites: [
        { title: '', url: '', icon: '' },
        { title: '', url: '', icon: '' },
        { title: '', url: '', icon: '' },
        { title: '', url: '', icon: '' },
        { title: '', url: '', icon: '' },
      ],
      datetime: {
        seconds: false,
        h24: true,
      },
    });
  }

  public async upgrade(): Promise<void> {}
}
