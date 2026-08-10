import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  getAuth 
} from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

export async function login(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function signUp(email: string, password: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
