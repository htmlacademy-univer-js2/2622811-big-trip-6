import ApiService from './framework/api-service';

export class EventsApiService extends ApiService {
  async getPoints() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  async newPoint(point) {
    return await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'})
    }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    return await this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'})
    }).then(ApiService.parseResponse);
  }

  async deletePoint(point) {
    return await this._load({
      url: `points/${point.id}`,
      method: 'DELETE'
    });
  }

  async getDestinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  async getOffers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }
}
