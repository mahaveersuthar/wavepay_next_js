import SignInForm from "@/components/auth/SignInForm";
import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";




export default function Home() {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <ThemeProvider>
                <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
                    <SignInForm />
                    <div className="lg:w-1/2 w-full h-full relative hidden lg:block">
                        {/* Background Image */}
                        <Image
                            src="/images/logo/wavepay-logo.png"
                            alt="WavePay Background"
                            fill
                            priority
                            className="object-contain"
                        />
                       
                    </div>

                    <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
}
