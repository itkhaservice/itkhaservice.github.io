import { db } from '../firebase.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const idtSettingsCollection = collection(db, "idtSettings");

// Add new IDT setting
export const addIdtSetting = async (setting) => {
    try {
        // Security Note: Storing sensitive information like username and password directly in client-side accessible code
        // and Firestore should be done with extreme caution.
        // For production environments, consider using Firebase Cloud Functions or a backend server
        // to handle and secure these credentials, and only expose necessary non-sensitive information to the client.
        const docRef = await addDoc(idtSettingsCollection, setting);
        console.log("IDT Setting added with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding IDT setting: ", e);
        throw e;
    }
};

// Get all IDT settings
export const getAllIdtSettings = async () => {
    try {
        const settingsList = [];
        const querySnapshot = await getDocs(idtSettingsCollection);
        querySnapshot.forEach((doc) => {
            settingsList.push({ id: doc.id, ...doc.data() });
        });
        return settingsList;
    } catch (e) {
        console.error("Error getting IDT settings: ", e);
        throw e;
    }
};

// Update IDT setting
export const updateIdtSetting = async (id, setting) => {
    try {
        const idtSettingDoc = doc(db, "idtSettings", id);
        await updateDoc(idtSettingDoc, setting);
        console.log("IDT Setting updated successfully");
    } catch (e) {
        console.error("Error updating IDT setting: ", e);
        throw e;
    }
};

// Delete IDT setting
export const deleteIdtSetting = async (id) => {
    try {
        const idtSettingDoc = doc(db, "idtSettings", id);
        await deleteDoc(idtSettingDoc);
        console.log("IDT Setting deleted successfully");
    } catch (e) {
        console.error("Error deleting IDT setting: ", e);
        throw e;
    }
};
