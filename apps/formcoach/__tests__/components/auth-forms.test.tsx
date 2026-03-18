/**
 * Auth Form Component Tests
 * Tests: SignupPage, LoginPage form validation and rendering
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Next.js navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  usePathname: () => '/',
}));

// Mock API module
const mockApi = {
  signup: jest.fn(),
  login: jest.fn(),
};

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: mockApi,
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import SignupPage from '@/app/(auth)/signup/page';
import LoginPage from '@/app/(auth)/login/page';
import { ApiError } from '@/lib/api';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignupPage', () => {
  it('should render signup form', () => {
    render(<SignupPage />);

    expect(screen.getByText('회원가입')).toBeInTheDocument();
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument();
    expect(screen.getByText('가입하기')).toBeInTheDocument();
  });

  it('should show link to login page', () => {
    render(<SignupPage />);
    expect(screen.getByText('로그인')).toBeInTheDocument();
  });

  it('should show name validation error for short name', async () => {
    render(<SignupPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('이름');
    await user.type(nameInput, 'A');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(screen.getByText('이름은 2자 이상이어야 합니다.')).toBeInTheDocument();
    });
  });

  it('should show email validation error', async () => {
    render(<SignupPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('이름');
    const emailInput = screen.getByLabelText('이메일');
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'not-an-email');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(screen.getByText('유효한 이메일을 입력해주세요.')).toBeInTheDocument();
    });
  });

  it('should show password length error', async () => {
    render(<SignupPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('이름');
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Short1');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(screen.getByText('비밀번호는 8자 이상이어야 합니다.')).toBeInTheDocument();
    });
  });

  it('should show password complexity error', async () => {
    render(<SignupPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('이름');
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'alllowercase');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(screen.getByText('대소문자와 숫자를 포함해야 합니다.')).toBeInTheDocument();
    });
  });

  it('should show password mismatch error', async () => {
    render(<SignupPage />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('이름');
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const confirmInput = screen.getByLabelText('비밀번호 확인');

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'TestPass123');
    await user.type(confirmInput, 'Different123');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
    });
  });

  it('should call api.signup on valid form submission', async () => {
    mockApi.signup.mockResolvedValue({});
    render(<SignupPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이름'), 'Test User');
    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'TestPass123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'TestPass123');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(mockApi.signup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'TestPass123',
        name: 'Test User',
      });
    });
  });

  it('should redirect to dashboard on successful signup', async () => {
    mockApi.signup.mockResolvedValue({});
    render(<SignupPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이름'), 'Test User');
    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'TestPass123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'TestPass123');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show duplicate email error', async () => {
    mockApi.signup.mockRejectedValue(new ApiError('Duplicate', 409));
    render(<SignupPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이름'), 'Test User');
    await user.type(screen.getByLabelText('이메일'), 'existing@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'TestPass123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'TestPass123');

    fireEvent.submit(screen.getByText('가입하기'));

    await waitFor(() => {
      expect(screen.getByText('이미 사용 중인 이메일입니다.')).toBeInTheDocument();
    });
  });
});

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);

    expect(screen.getByText('로그인')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('should show link to signup page', () => {
    render(<LoginPage />);
    expect(screen.getByText('회원가입')).toBeInTheDocument();
  });

  it('should show error when fields are empty', async () => {
    render(<LoginPage />);

    fireEvent.submit(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(screen.getByText('이메일과 비밀번호를 입력해주세요.')).toBeInTheDocument();
    });
  });

  it('should call api.login on valid submission', async () => {
    mockApi.login.mockResolvedValue({});
    render(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'TestPass123');

    fireEvent.submit(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(mockApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'TestPass123',
      });
    });
  });

  it('should redirect to dashboard on successful login', async () => {
    mockApi.login.mockResolvedValue({});
    render(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'test@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'TestPass123');

    fireEvent.submit(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show auth failed error', async () => {
    mockApi.login.mockRejectedValue(new ApiError('Auth failed', 401));
    render(<LoginPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('이메일'), 'wrong@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'WrongPass123');

    fireEvent.submit(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument();
    });
  });
});
