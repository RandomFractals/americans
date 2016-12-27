jest.dontMock('../../src/census/location-service.js');

// create Location Service instance
const LocationService = require('../../src/census/location-service.js');
const locationService = new LocationService();


describe('Location Service States Lookup Tests', () => {

  it('has loaded 50+ US states FIPS config data', () => {
    expect(locationService.states.size).toBeGreaterThanOrEqual(50);
  });

  it('has loaded IL state info', () => {
    expect(locationService.states.get('il').toString()).toEqual('Illinois');
  });

  it('has Illinois state info', () => {
    expect(locationService.stateNameMap.get('illinois').toString()).toEqual('Illinois');
  });

  it('IL is a valid state', () => {
    expect(locationService.isValidState('IL')).toEqual(true);
  });

  it('Illinois is a valid state', () => {
    expect(locationService.isValidState('Illinois')).toEqual(true);
  });

  it('BR is NOT a valid state!', () => {
    expect(locationService.isValidState('BR')).toEqual(false);
  });

  it('Brr! is NOT a valid state!', () => {
    expect(locationService.isValidState('Brr!')).toEqual(false);
  });

  it('Illinoise is NOT a valid state! :)', () => {
    expect(locationService.isValidState('Illinoise')).toEqual(false);
  });

});


describe('Location Service ZipCode Lookup Tests', () => {

  it('80081 is a valid zip code', () => {
    expect(locationService.isValidZipCode('80081')).toEqual(true);
  });

  it('8000 is NOT a valid zip code', () => {
    expect(locationService.isValidZipCode('8000')).toEqual(false);
  });

  it('ZipCo is NOT a valid zip code', () => {
    expect(locationService.isValidZipCode('ZipCo')).toEqual(false);
  });

});


describe('Location Service Counties Lookup Tests', () => {

  it('has loaded 3000+ US counties FIPS config data', () => {
    expect(locationService.counties.size).toBeGreaterThan(3000);
  });

  it('has loaded Cook County info', () => {
    expect(locationService.counties.get('cook,il').toString()).toEqual('Cook County, IL');
  });

  it('has some matching county names across all states', () => {
    expect(locationService.countyMapList.size).toBeLessThan(locationService.counties.size);
  });

  it('has more than 1 Lake County across all states', () => {
    expect(locationService.countyMapList.get('lake').length).toBeGreaterThan(1);
  });

  it('Brewster county is a valid county', () => {
    expect(locationService.isValidCounty('Brewster county')).toEqual(true);
  });

  it('Brewster, TX is a valid county', () => {
    expect(locationService.isValidCounty('Brewster, TX')).toEqual(true);
  });

  it('Brewster County, Texas is a valid county', () => {
    expect(locationService.isValidCounty('Brewster County, Texas')).toEqual(true);
  });

  it('Brew is NOT a valid county!', () => {
    expect(locationService.isValidCounty('Brew')).toEqual(false);
  });
});
