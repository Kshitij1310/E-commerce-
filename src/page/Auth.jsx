import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const isFormValid = useMemo(() => {
    const hasName = !isSignup || values.name.trim().length > 0;
    const hasEmail = values.email.trim().length > 0;
    const hasPassword = values.password.length >= 6;
    return hasName && hasEmail && hasPassword;
  }, [isSignup, values]);

  const validate = () => {
    const nextErrors = {};
    if (isSignup && values.name.trim().length === 0) {
      nextErrors.name = "Name is required";
    }
    if (values.email.trim().length === 0) {
      nextErrors.email = "Email is required";
    }
    if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    if (isSignup) {
      const result = signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      if (!result.ok) {
        setErrors({ form: result.message });
        return;
      }
    } else {
      const result = login({
        email: values.email.trim(),
        password: values.password,
      });
      if (!result.ok) {
        setErrors({ form: result.message });
        return;
      }
    }

    navigate("/product", { replace: true });
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setErrors({});
    setValues({ name: "", email: "", password: "" });
  };

  if (user) {
    return <Navigate to="/product" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignup ? "Create account" : "Welcome back"}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {isSignup
              ? "Sign up to start shopping."
              : "Login to continue to your account."}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form ? (
              <p className="text-sm text-red-600">{errors.form}</p>
            ) : null}
            {isSignup ? (
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                {errors.name ? (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                ) : null}
              </div>
            ) : null}

            <div>
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email ? (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <Label className="text-sm font-medium">Password</Label>
              <Input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
              {errors.password ? (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              ) : null}
            </div>

            <Button type="submit" disabled={!isFormValid} className="w-full">
              {isSignup ? "Sign up" : "Login"}
            </Button>
          </form>

          <Button
            type="button"
            variant="ghost"
            onClick={toggleMode}
            className="mt-4 w-full"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don’t have an account? Sign up"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

