import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut} from "firebase/auth";
import { 
    addDoc, 
    collection, 
    getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password)=>{
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "user"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
        toast.success("Account created successfully!");
    } catch (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Failed to create account");
        throw error;
    }
}

const login = async (email, password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
    } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Failed to sign in");
        throw error;
    }
}

const logout = ()=>{
    signOut(auth);
}

export {auth, db, login, signup, logout};