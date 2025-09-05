import { cookies } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";
import { email } from "zod";

export async function requiredAuth(){
    const cookie = await cookies()
    const token =  cookie.get('session')?.value
    if(!token) throw Object.assign(new Error("Unauthorized"), {status: 401})

    // Verifikasi toke Firebase
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null)
    if(!decoded) throw Object.assign(new Error("Unauthorized"), {status: 401})

    // Ambil role dari firestore
    const snap = await adminDb.collection("users").doc(decoded.uid).get()
    const role = snap.exists ? snap.data()?.role : null

    return {uid: decoded.uid, email: decoded.email, role}
}

export function requiredAdmin(role?:string){
    if(role !== 'admin' && role !== 'superAdmin' ){
        throw Object.assign(new Error("Forbidden"), {status: 403})
    }
}

export function requiredSuperAdmin(role?: string){
    if(role !== 'superAdmin'){
        throw Object.assign(new Error("Forbidden"), {status: 403})
    }
}