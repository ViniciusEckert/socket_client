"use client"

import { useEffect, useState } from "react";
import  io  from "socket.io-client";

const socket = io("http://localhost:8080")

export default function Home() {
  return (
    <main className="w-screen h-screen bg-black"></main>
  );
}
