import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SiteCoordinatorModule} from '../../site-coordinator.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {EntityService} from '../../../service/entity.service';
import {ApiResponse} from 'src/app/entity/api.response.model';
import {throwError, of} from 'rxjs';
import {App} from './app.model';
import {expectedAppList} from 'src/app/entity/mock-apps-data';
import {AppsService} from './apps.service';
import {expectedAppDetails} from 'src/app/entity/mock-app-details';
import {HttpClient} from '@angular/common/http';
describe('StudiesService', () => {
  let appsService: AppsService;
  let httpServiceSpyObj: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SiteCoordinatorModule,
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AppsService, EntityService],
    });
  });

  it('should be created', () => {
    const service: AppsService = TestBed.get(AppsService) as AppsService;
    expect(service).toBeTruthy();
  });

  it('should return expected Apps List', fakeAsync(() => {
    const entityServicespy = jasmine.createSpyObj<EntityService<App>>(
      'EntityService',
      {getCollection: of(expectedAppList)},
    );
    appsService = new AppsService(entityServicespy, httpServiceSpyObj);

    appsService
      .getAppsOfUser()
      .subscribe(
        (app) => expect(app).toEqual(expectedAppList, 'expected AppsList'),
        fail,
      );
    expect(entityServicespy.getCollection).toHaveBeenCalledTimes(1);
  }));

  it('should return an error when the server returns a 400', fakeAsync(() => {
    const errorResponses: ApiResponse = {
      message: 'Bad Request',
    } as ApiResponse;
    const entityServicespy = jasmine.createSpyObj<EntityService<App>>(
      'EntityService',
      {getCollection: throwError(errorResponses)},
    );
    appsService = new AppsService(entityServicespy, httpServiceSpyObj);

    tick(40);
    appsService.getAppsOfUser().subscribe(
      () => fail('expected an error'),
      (error: ApiResponse) => {
        expect(error.message).toBe('Bad Request');
      },
    );
  }));
  it('should return apps list for the user creation', () => {
    const entityServicespy = jasmine.createSpyObj<EntityService<App>>(
      'EntityService',
      {getCollection: of()},
    );
    const httpServiceSpyObj = jasmine.createSpyObj<HttpClient>('HttpClient', {
      get: of(expectedAppDetails),
    });
    appsService = new AppsService(entityServicespy, httpServiceSpyObj);

    appsService
      .getAllAppsWithStudiesAndSites()
      .subscribe(
        (appDetails) =>
          expect(appDetails).toEqual(
            expectedAppDetails,
            'expected App Details',
          ),
        fail,
      );
    expect(httpServiceSpyObj.get).toHaveBeenCalledTimes(1);
  });
  it('should return an error when the server returns a error status code', fakeAsync(() => {
    const errorResponse = {
      message: 'User does not exist',
    } as ApiResponse;
    const entityServicespy = jasmine.createSpyObj<EntityService<App>>(
      'EntityService',
      {getCollection: of()},
    );
    const httpServiceSpyObj = jasmine.createSpyObj<HttpClient>('HttpClient', {
      get: throwError(errorResponse),
    });
    appsService = new AppsService(entityServicespy, httpServiceSpyObj);
    appsService.getAllAppsWithStudiesAndSites().subscribe(
      () => fail('expected an error, not app details'),
      (error: ApiResponse) => {
        expect(error.message).toContain(errorResponse.message);
      },
    );
  }));
});
