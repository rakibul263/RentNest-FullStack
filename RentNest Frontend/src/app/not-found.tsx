"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-grid relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl" />
        <p className="relative text-8xl font-extrabold tracking-tighter text-primary sm:text-9xl">
          404
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h1 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back home.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <Link href="/properties">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Search className="h-4 w-4" /> Browse Properties
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
