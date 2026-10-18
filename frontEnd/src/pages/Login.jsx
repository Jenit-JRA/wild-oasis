
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";


const LoginLayout = styled.main`
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: minmax(0, 420px);
  place-content: center;

  padding: 32px 20px;

  background:
    linear-gradient(
      rgba(18, 35, 23, 0.45),
      rgba(18, 35, 23, 0.65)
    ),
    url("https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=2000&q=85")
      center / cover no-repeat;
`;


const LoginBox = styled.div`
  width: 100%;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  background: #fffdf7;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    padding: 28px 22px;
  }
`;

const Brand = styled.div`
  margin-bottom: 30px;
  text-align: center;
  color: #29412c;
`;

const BrandName = styled.h1`
  margin: 0;
  font-family: Georgia, serif;
  font-size: 28px;
  letter-spacing: 3px;
`;

const BrandSubtitle = styled.p`
  margin: 6px 0 0;
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
`;

const Title = styled.h2`
  margin: 0 0 8px;
  text-align: center;
  color: #202820;
  font-size: 25px;
`;

const Subtitle = styled.p`
  margin: 0 0 28px;
  text-align: center;
  color: #6b7069;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #303a30;
  font-size: 13px;
  font-weight: 600;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 13px 14px;
  border: 1px solid #dedfd7;
  border-radius: 7px;
  background: white;
  color: #202820;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #36543a;
    box-shadow: 0 0 0 3px rgba(54, 84, 58, 0.1);
  }

  &::placeholder {
    color: #a0a39c;
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 65px;
`;

const TogglePassword = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #36543a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 12px;
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  color: #555d54;
  cursor: pointer;

  input {
    accent-color: #36543a;
  }
`;

const TextLink = styled(Link)`
  color: #29412c;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Error = styled.span`
  color: #b42318;
  font-size: 12px;
`;

const ServerError = styled.p`
  margin: 0;
  color: #b42318;
  font-size: 13px;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 4px;
  border: none;
  border-radius: 7px;
  background: #304a32;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #223925;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const RegisterText = styled.p`
  margin: 24px 0 0;
  color: #686d65;
  font-size: 13px;
  text-align: center;
`;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (details) => {
    setLoginError("");

    try {
      const result = await login(details);
      console.log(result)
      if (result.data.role === "user") {
        navigate("/home", { replace: true });
      } else if (result.data.role === "admin") {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setLoginError(error.message || "Unable to log in. Please try again.");
    }
  };

  return (
    <LoginLayout>
      <LoginBox>
        <Brand>
          <BrandName>WILD OASIS</BrandName>
          <BrandSubtitle>Hotel & Cabins</BrandSubtitle>
        </Brand>

        <Title>Welcome Back</Title>
        <Subtitle>Log in to continue your journey</Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <Label htmlFor="email">Email address</Label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
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

            <InputWrapper>
              <PasswordInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <TogglePassword
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </TogglePassword>
            </InputWrapper>

            {errors.password && (
              <Error>{errors.password.message}</Error>
            )}
          </Field>

          <FormOptions>
            <RememberMe>
              <input type="checkbox" />
              Remember me
            </RememberMe>

            <TextLink to="/forgot-password">
              Forgot password?
            </TextLink>
          </FormOptions>

          {loginError && (
            <ServerError role="alert">{loginError}</ServerError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </Form>

        <RegisterText>
          Do not have an account?{" "}
          <TextLink to="/register">Sign up</TextLink>
        </RegisterText>
      </LoginBox>
    </LoginLayout>
  );
}

export default Login;
