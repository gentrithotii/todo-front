import { useEffect } from "react";
import { useForm } from "react-hook-form";

const RegisterUser = ({ onRegister, toUpdateUser, update }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  useEffect(() => {
    if (toUpdateUser) {
      setValue("name", toUpdateUser.name || "");
      setValue("email", toUpdateUser.email || "");
    } else {
      reset();
    }
  }, [setValue, toUpdateUser, reset]);

  const onSubmit = (data) => {
    if (toUpdateUser) {
      update(toUpdateUser.id, {
        id: toUpdateUser.id,
        name: data.name,
        email: data.email,
      });
    } else if (onRegister) {
      onRegister(data);
    }
    reset();
  };

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          className={`form-control form-control-sm ${
            errors.name ? "is-invalid" : ""
          }`}
          placeholder="Enter full name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className={`form-control form-control-sm ${
            errors.email ? "is-invalid" : ""
          }`}
          placeholder="Enter email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      {!toUpdateUser && (
        <>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`form-control form-control-sm ${
                errors.username ? "is-invalid" : ""
              }`}
              placeholder="Enter username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`form-control form-control-sm ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control form-control-sm ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              placeholder="Re-enter password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <div className="mb-3 w-25">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className={`form-select form-select-sm ${
                errors.userRole ? "is-invalid" : ""
              }`}
              {...register("userRole", { required: "Role is required" })}
            >
              <option value="">Select a role</option>
              <option value="ADMIN">Admin</option>
              <option value="MODERATOR">Moderator</option>
              <option value="USER">User</option>
            </select>
            {errors.userRole && (
              <div className="invalid-feedback">{errors.userRole.message}</div>
            )}
          </div>
        </>
      )}

      <button type="submit" className="btn btn-primary btn-sm">
        {toUpdateUser ? (
          <>
            <i className="bi bi-pencil"></i> Update
          </>
        ) : (
          <>
            <i className="bi bi-person-plus"></i> Register
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterUser;
