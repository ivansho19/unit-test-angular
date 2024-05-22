import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['generateNumbers', 'checkOperation']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        FormBuilder
      ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Configurar el formulario
    component.form = new FormBuilder().group({
      result: [''],
      email: [''],
      password: ['']
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'unit-test-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('unit-test-app');
  });

  it('Debe inicializar el formulario y la funcion checkHuman en el ngOnInit', () => {
    // Arrange: Preparar el entorno para la prueba
    const mockNumbers = [1, 2];
    dataService.generateNumbers.and.returnValue(mockNumbers);
    
    // Act: Ejecutar el método que queremos probar
    component.ngOnInit();

    // Assert: Verificar que el resultado es el esperado
    expect(component.form).toBeDefined();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
    expect(component.form.get('result')).toBeTruthy();
    expect(dataService.generateNumbers).toHaveBeenCalled();
    expect(component.checkHuman).toEqual(mockNumbers);
  });

  it('Debe llamar al servicio authService.login con el email y password si la operacion check es succeeds', fakeAsync(() => {
    component.checkHuman = [1, 2];
    component.form.setValue({ result: 3, email: 'test@example.com', password: 'password' });
    dataService.checkOperation.and.returnValue(true);
    const loginResponse = { some: 'response' };
    authService.login.and.returnValue(of(loginResponse));

    component.sendLogin();
    tick(); // Simula el paso del tiempo para completar las operaciones asincrónicas

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(component.dataSession).toBe(loginResponse);
    expect(component.isCheck).toBeUndefined();
  }));

  it('La variable isCheck debe estar en "ERROR_CHECK" si la operacion check es falso', () => {
    // Arrange: Preparar el entorno para la prueba
    component.checkHuman = [1, 2];
    component.form.setValue({ result: 3, email: '', password: '' });
    dataService.checkOperation.and.returnValue(false);

    // Act: Ejecutar el método que queremos probar
    component.sendLogin();

    // Assert: Verificar que el resultado es el esperado
    expect(component.isCheck).toBe('ERROR_CHECK');
    expect(authService.login).not.toHaveBeenCalled();
  });
});
