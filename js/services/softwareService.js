import { db } from '../firebase.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const softwareCollection = collection(db, "software");

// Add new software
export const addSoftware = async (software) => {
    try {
        const docRef = await addDoc(softwareCollection, software);
        console.log("Software added with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding software: ", e);
        throw e;
    }
};

// Get all software
export const getAllSoftware = async () => {
    try {
        const softwareList = [];
        const querySnapshot = await getDocs(softwareCollection);
        querySnapshot.forEach((doc) => {
            softwareList.push({ id: doc.id, ...doc.data() });
        });
        return softwareList;
    } catch (e) {
        console.error("Error getting software: ", e);
        throw e;
    }
};

// Update software
export const updateSoftware = async (id, software) => {
    try {
        const softwareDoc = doc(db, "software", id);
        await updateDoc(softwareDoc, software);
        console.log("Software updated successfully");
    } catch (e) {
        console.error("Error updating software: ", e);
        throw e;
    }
};

// Delete software
export const deleteSoftware = async (id) => {
    try {
        const softwareDoc = doc(db, "software", id);
        await deleteDoc(softwareDoc);
        console.log("Software deleted successfully");
    } catch (e) {
        console.error("Error deleting software: ", e);
        throw e;
    }
};
