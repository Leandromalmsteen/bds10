import { useHistory, useParams } from 'react-router-dom';
import './styles.css';
import { useEffect, useState } from 'react';
import { Department } from 'types/department';
import { Controller, useForm } from 'react-hook-form';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';
import Select from 'react-select';

type UrlParams = {
  employeeId: string;
};

const Form = () => {
  const { employeeId } = useParams<UrlParams>();

  const history = useHistory();

  const [selectCategories, setSelectCategories] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Employee>();

  useEffect(() => {
    requestBackend({
      url: `/departments`,
      withCredentials: true,
    }).then((response) => {
      setSelectCategories(response.data);
    });
  }, []);

  useEffect(() => {
    requestBackend({
      url: `/employees/${employeeId},`,
      withCredentials: true,
    }).then((response) => {
      const employee = response.data as Employee;

      setValue('name', employee.name);
      setValue('email', employee.email);
      setValue('department', employee.department);
    });
  }, [employeeId, setValue]);

  const onSubmit = (formData: Employee) => {
    const data = {
      ...formData,
    };

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/employees',
      data,
      withCredentials: true,
    };

    requestBackend(config)
      .then(() => {
        toast.info('Cadastrado com sucesso');
        history.push('/admin/employees');
      })
      .catch(() => {
        toast.error('Erro ao cadastrar funcionário');
      });
  };

  const handleCancel = () => {
    history.push('/admin/employees');
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">
              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Employeer Name"
                  name="name"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i,
                      message: 'Email inválido',
                    },
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  }`}
                  placeholder="Employeer Email"
                  name="email"
                  data-testid="email"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
                <div className="invalid-feedback d-block"></div>
              </div>
              <div className="margin-bottom-30 ">
                <label htmlFor="department" className="d-none">
                  Departamento
                </label>
                <Controller
                  name="department"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectCategories}
                      classNamePrefix="product-crud-select"
                      isMulti
                      getOptionLabel={(department: Department) =>
                        department.name
                      }
                      getOptionValue={(department: Department) =>
                        String(department.id)
                      }
                      inputId="department"
                    />
                  )}
                />
                {errors.department && (
                  <div className="invalid-feedback d-block">
                    Campo obrigatório
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
