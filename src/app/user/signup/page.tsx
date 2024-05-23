"use client";
import { AtSign } from "lucide-react";
import { handleRegisterRequest } from "../action";
import { SubmitButton } from "./component/SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SignUpPage() {
  const route = useRouter();
  const [userInput, setUserInput] = useState<{}>({
    email: "",
  });

  const [vaildInput, setValidInput] = useState<boolean>(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^@\s]+\.com$/; // Existing regex
    return emailRegex.test(value) && value.endsWith("@gmail.com");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const vaild = validateEmail(value);
    setUserInput((prev) => ({ ...prev, [name]: value }));
    setValidInput(vaild);
  };

  const handleSubmit = async () => {
    const action = await handleRegisterRequest(userInput);
    if (action === "success") {
      route.replace("/user/signup/success");
    }
  };

  return (
    <div className="w-full m-auto">
      <div className="w-full flex justify-center mt-40 flex-col items-center gap-4">
        <p className="text-5xl text-teal-700">PhysioFlow</p>
        <div className="flex flex-col gap-4">
          <form action={() => handleSubmit()} className="space-y-4">
            <label className="relative block">
              <span className="sr-only">Email</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <AtSign className="text-teal-400" size={24} />
              </span>
              <input
                className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-MidnightMystery rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-MidnightMystery/30 focus:ring-2 sm:text-sm"
                placeholder="Email"
                type="email"
                name="email"
                onChange={handleChange}
                // pattern="[a-zA-Z0-9]@gmail.com"
              />
            </label>
            <p
              className={`text-rose-800 ${
                vaildInput && "!text-teal-800"
              } text-sm`}
            >
              Please provide your offical Gmail address
            </p>
            <SubmitButton disabled={vaildInput} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
