import { TestBed } from '@angular/core/testing';
import { LocalDataService } from './local-data.service';

describe('LocalDataService', () => {
  let service: LocalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDataService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve data', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    service.saveData(key, value);
    const retrievedValue = service.getData<typeof value>(key);
    expect(retrievedValue).toEqual(value);
  });

  it('should return null for non-existent key', () => {
    const retrievedValue = service.getData('nonExistentKey');
    expect(retrievedValue).toBeNull();
  });

  it('should remove data', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    service.saveData(key, value);
    service.removeData(key);
    const retrievedValue = service.getData<typeof value>(key);
    expect(retrievedValue).toBeNull();
  });

  it('should clear all data', () => {
    const key1 = 'testKey1';
    const value1 = { data: 'testData1' };
    const key2 = 'testKey2';
    const value2 = { data: 'testData2' };
    service.saveData(key1, value1);
    service.saveData(key2, value2);
    service.clearData();
    expect(service.getData<typeof value1>(key1)).toBeNull();
    expect(service.getData<typeof value2>(key2)).toBeNull();
  });

  it('should handle invalid JSON data gracefully', () => {
    const key = 'invalidKey';
    localStorage.setItem(key, 'invalid JSON');
    const retrievedValue = service.getData(key);
    expect(retrievedValue).toBeNull();
  });
});
