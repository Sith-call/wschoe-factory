"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import api, { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await api.login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401)
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        else setError(err.message);
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
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
          <h2 className="mb-1 text-center text-xl font-bold">로그인</h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            계정에 로그인하세요
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              로그인
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
