import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { register as registerUser } from "../services/apiAuth";

const RegisterLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

const RegisterBox = styled.div`
  background-color: var(--color-grey-0);
  padding: 4.8rem;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
`;

const Title = styled.h1`
  margin-bottom: 3.2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const Error = styled.span`
  color: var(--color-red-700);
  font-size: 1.2rem;
`;

const ServerError = styled.p`
  color: var(--color-red-700);
  text-align: center;
`;

const Button = styled.button`
  padding: 1.2rem;
  margin-top: 1rem;
`;

const LoginText = styled.p`
  margin-top: 2.4rem;
  text-align: center;
`;

function Register() {
    const [registerError, setRegisterError] = useState("");

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (details) => {
        setRegisterError("");

        try {
            const data = await registerUser(details);

            console.log("Registration successful:", data);

            navigate("/login");

        } catch (error) {
            setRegisterError(error.message);
        }
    };

    return (
        <RegisterLayout>
            <RegisterBox>
                <Title>Create Account</Title>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Field>
                        <Label htmlFor="name">Name</Label>

                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />

                        {errors.name && (
                            <Error>{errors.name.message}</Error>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />

                        {errors.email && (
                            <Error>{errors.email.message}</Error>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                        />

                        {errors.password && (
                            <Error>{errors.password.message}</Error>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>

                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                        />

                        {errors.confirmPassword && (
                            <Error>
                                {errors.confirmPassword.message}
                            </Error>
                        )}
                    </Field>

                    {registerError && (
                        <ServerError>{registerError}</ServerError>
                    )}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Register"}
                    </Button>
                </Form>

                <LoginText>
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </LoginText>
            </RegisterBox>
        </RegisterLayout>
    );
}

export default Register;