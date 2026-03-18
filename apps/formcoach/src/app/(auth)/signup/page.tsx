"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import api, { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name || name.length < 2) e.name = "이름은 2자 이상이어야 합니다.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "유효한 이메일을 입력해주세요.";
    if (!password || password.length < 8)
      e.password = "비밀번호는 8자 이상이어야 합니다.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      e.password = "대소문자와 숫자를 포함해야 합니다.";
    if (password !== confirmPassword)
      e.confirmPassword = "비밀번호가 일치하지 않습니다.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await api.signup({ email, password, name });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) setGeneralError("이미 사용 중인 이메일입니다.");
        else setGeneralError(err.message);
      } else {
        setGeneralError("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 block text-center">
            <span className="text-2xl font-extrabold text-brand-600">
              FormCoach
            </span>
          </Link>
          <h2 className="mb-1 text-center text-xl font-bold">회원가입</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            계정을 만들고 맞춤 운동을 시작하세요
          </p>

          {generalError && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상, 대소문자+숫자"
              error={errors.password}
              autoComplete="new-password"
            />
            <Input
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              가입하기
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
