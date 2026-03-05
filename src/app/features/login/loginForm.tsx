import { useAuth } from "@/app/core/auth/authContext";
import { useLoggedInUser } from "@/app/core/contexts/loggedInUserContext";
import { useSetting } from "@/app/core/contexts/settingContext";
import { LoginRequest } from "@/app/core/data/loginRequest";
import {
  useFormValidation,
  type ValidationRule,
} from "@/app/core/hooks/useFormValidation";
import ApiConstants from "@/app/core/networking/apiConstants";
import YusrApiHelper from "@/app/core/networking/yusrApiHelper";
import { Validators } from "@/app/core/utils/validators";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type User from "../users/data/user";

import { SystemPermissions } from "@/app/core/auth/systemPermissions";
import type { Setting } from "@/app/core/data/setting";
import placeholderImg from "@/assets/placeholder.svg";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<LoginRequest>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const { updateSetting } = useSetting();
  const { updateLoggedInUser } = useLoggedInUser();

  const validationRules: ValidationRule<Partial<LoginRequest>>[] = [
    {
      field: "email",
      selector: (d) => d.companyEmail,
      validators: [Validators.required("البريد الإلكتروني مطلوب")],
    },
    {
      field: "username",
      selector: (d) => d.username,
      validators: [Validators.required("اسم المستخدم مطلوب")],
    },
    {
      field: "password",
      selector: (d) => d.password,
      validators: [Validators.required("كلمة المرور مطلوبة")],
    },
  ];
  const { getError, isInvalid, validate, clearError, errorInputClass } =
    useFormValidation(formData, validationRules);

  const Login = async () => {
    if (!validate()) return;

    const request = new LoginRequest({
      companyEmail: formData.companyEmail,
      username: formData.username,
      password: formData.password,
    });

    setLoading(true);

    const result = await YusrApiHelper.Post<{user: User, setting: Setting}>(`${ApiConstants.baseUrl}/Login`, request);

    if (result.status === 200 && result.data) {
      login(result.data.user);
      updateLoggedInUser(result.data.user);
      updateSetting(result.data.setting);

      const origin =
        location.state?.from?.pathname ||
        SystemPermissions.getFirstPermissionPath(
          result.data.user.role.permissions || [],
        );

      setLoading(false);

      setTimeout(() => {
        navigate(origin, { replace: true });
      }, 10);
    } 
    else {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">أهلا بك مجددًا</h1>
                <p className="text-muted-foreground text-balance">
                  سجل الدخول إلى حسابك
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.companyEmail || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, companyEmail: e.target.value });
                    clearError("email");
                  }}
                  className={errorInputClass("email")}
                  required
                />
                {isInvalid("email") && (
                  <span className="text-xs text-red-500">
                    {getError("email")}
                  </span>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="username">اسم المستخدم</FieldLabel>
                </div>
                <Input
                  id="username"
                  type="text"
                  value={formData.username || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    clearError("username");
                  }}
                  className={errorInputClass("username")}
                  required
                />
                {isInvalid("username") && (
                  <span className="text-xs text-red-500">
                    {getError("username")}
                  </span>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    clearError("password");
                  }}
                  className={errorInputClass("password")}
                  required
                />
                {isInvalid("password") && (
                  <span className="text-xs text-red-500">
                    {getError("password")}
                  </span>
                )}
              </Field>

              <Field>
                <Button type="button" disabled={loading} onClick={Login}>
                  {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  تسجيل الدخول
                </Button>
              </Field>
              <FieldDescription className="text-center">
                لا تملك حسابًا بعد؟ <a href="#">سجل معنا</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={placeholderImg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
