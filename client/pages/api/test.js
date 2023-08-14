import { NextResponse } from "next/server";

export default async function POST(request) {
    console.log(request)
    const data = await request.json();
    console.log(data);
    return NextResponse.redirect('http://localhost:3000/predict/');
}