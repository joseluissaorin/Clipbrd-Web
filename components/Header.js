"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";

const links = [
  {
    href: "/#features",
    label: "Features",
  },
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
  {
    href: "/privacy-policy",
    label: "Privacy",
  },
];

const cta = <ButtonSignin text="Get Started" extraStyle="btn-primary" />;

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="bg-base-100">
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Logo/name */}
        <div className="flex lg:flex-1">
          <Link
            className="flex items-center gap-3 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
          >
            <div className="relative w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(98,216,255,0.3)]">
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-10 h-10"
                placeholder="blur"
                priority={true}
                width={40}
                height={40}
              />
            </div>
            <span className="font-extrabold text-lg">{config.appName}</span>
          </Link>
        </div>

        {/* Burger button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-base-content"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="link link-hover text-base-content/80 hover:text-base-content"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1">{cta}</div>

        {/* Mobile menu */}
        <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
          <div className="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-100 sm:max-w-sm sm:ring-1 sm:ring-neutral/10">
            {/* Mobile logo/name */}
            <div className="flex items-center justify-between">
              <Link
                className="flex items-center gap-3 shrink-0"
                href="/"
                title={`${config.appName} homepage`}
              >
                <div className="relative w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shadow-[0_0_15px_rgba(98,216,255,0.3)]">
                  <Image
                    src={logo}
                    alt={`${config.appName} logo`}
                    className="w-10 h-10"
                    placeholder="blur"
                    priority={true}
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-extrabold text-lg">{config.appName}</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile links */}
            <div className="flow-root mt-6">
              <div className="py-4">
                <div className="flex flex-col gap-y-4 items-start">
                  {links.map((link) => (
                    <Link
                      href={link.href}
                      key={link.href}
                      className="link link-hover text-base-content/80 hover:text-base-content"
                      title={link.label}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="divider"></div>
              {/* Mobile CTA */}
              <div className="flex flex-col">{cta}</div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
