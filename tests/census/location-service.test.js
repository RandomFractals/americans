jest.dontMock('../../src/census/location-service.js');

// create Location Service instance
const LocationService = require('../../src/census/location-service.js');
const locationService = new LocationService();

// usa states tests
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

  it('has New York state info', () => {
    expect(locationService.stateNameMap.get('newyork').toString()).toEqual('New York');
  });

  it('IL is a valid state', () => {
    expect(locationService.isValidState('IL')).toEqual(true);
  });

  it('Illinois is a valid state', () => {
    expect(locationService.isValidState('Illinois')).toEqual(true);
  });

  it('New York is a valid state', () => {
    expect(locationService.isValidState('New York')).toEqual(true);
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

  it('getRegion("IL") state test', () => {
    expect(locationService.getRegion('IL').toString()).toEqual('Illinois');
  });

  it('getRegion("New York") state test', () => {
    expect(locationService.getRegion('New York').toString()).toEqual('New York');
  });

});


// usa counties tests
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

  it('getRegion("Brewster county, TX") county test', () => {
    expect(locationService.getRegion('Brewster county, TX').toString()).toEqual('Brewster County, TX');
  });

  it('getRegion("Brewster county, Texas") county test', () => {
    expect(locationService.getRegion('Brewster county, Texas').toString()).toEqual('Brewster County, TX');
  });

  it('getRegion("San Francisco county, ca") county test', () => {
    expect(locationService.getRegion('San Francisco county, ca').toString()).toEqual('San Francisco County, CA');
  });
  
});


// zipcode tests
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

  xit('getRegion("80082") zip code test', () => {
    expect(locationService.getRegion('80082').toString()).toEqual('80082');
  });
});


// usa places tests
describe('Location Service Places Lookup Tests', () => {

  it('has loaded 3K+ USA places FIPS config data', () => {
    expect(locationService.places.size).toBeGreaterThanOrEqual(3000);
  });

  it('getRegion("Chicago, il") city test', () => {
    expect(locationService.getRegion('Chicago, il').toString()).toEqual('Chicago city, IL');
  });

  it('getRegion("San Francisco, CA") city test', () => {
    expect(locationService.getRegion('San Francisco, CA').toString()).toEqual('San Francisco city, CA');
  });

  it('getRegion("San Francisco") test', () => {
    expect(locationService.getRegion('San Francisco').toString()).toEqual('San Francisco city, CA');
  });  

});


