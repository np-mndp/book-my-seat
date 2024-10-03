import {
    collection,
    getDocs,
    addDoc,
    doc,
    query,
    where,
    getDoc,
    setDoc,
  } from "firebase/firestore";
  import { auth, db } from "../configs/FirebaseConfig";
  import { signInWithEmailAndPassword } from "firebase/auth";
  
  class FirestoreController {
    // Singleton instance
    static instance = null;
  
    constructor() {
      if (FirestoreController.instance) {
        return FirestoreController.instance;
      }
  
      FirestoreController.instance = this;
    }
  
    // Static method to get the singleton instance
    static getInstance() {
      if (!FirestoreController.instance) {
        FirestoreController.instance = new FirestoreController();
      }
  
      return FirestoreController.instance;
    }
  
    //************* Methods *************/
  
    login = async (email, password) => {
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
  
        console.log(`Signed In successfully`);
        return {
          success: true,
        };
      } catch (err) {
        console.log(`Error while signing in : ${err}`);
      }
    };
  
    getProfile = async () => {
      try {
        if (auth.currentUser == null) {
          console.log(`No User Logged in`);
        } else {
          const profileRef = collection(db, "Owner");
          const q = query(
            profileRef,
            where("email", "==", auth.currentUser.email)
          );
  
          console.log(auth.currentUser.email);
          console.log({ profileRef });
          const querySnapshot = await getDocs(q);
          // const data = querySnapshot.data();
          const profile = [];
          querySnapshot.forEach((doc) => {
            console.log(`DOCUMENT DATA: ${doc.data()}`);
            profile.push({ id: doc.id, ...doc.data() });
          });
  
          // await Promise.all(
          //   querySnapshot.docs.map((doc) => {
          //     profile = doc.data();
          //   })
          // );
  
          console.log(
            { Profile: profile[0] },
            `JSON STRINGIFY : ${JSON.stringify(profile.img)}`
          );
          return profile;
        }
      } catch (error) {}
    };
  
    getListings = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const listingRef = collection(db, "Listing");
          const q = query(listingRef, where("owner", "==", user.email));
          const querySnapshot = await getDocs(q);
          const listings = [];
          querySnapshot.forEach((doc) => {
            listings.push({ id: doc.id, ...doc.data() });
          });
          return listings;
        } else {
          throw new Error("No user is logged in");
        }
      } catch (error) {
        console.error("Error fetching listings: ", error);
        return [];
      }
    };
  
    getListing = async (id) => {
      try {
        const docRef = doc(db, "Listing", id);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
      } catch (error) {
        console.log(`Error fetching listing: ${error}`);
      }
    };
  
    getBookings1 = async () => {
      try {
        const listings = await this.getListings();
        const bookings = [];
        await Promise.all(
          listings.map(async (tempDoc) => {
            const q = collection(db, "Listing/" + tempDoc.id + "/bookings");
  
            const querySnapshot = await getDocs(q);
  
            if (querySnapshot.size > 0) {
              await Promise.all(
                querySnapshot.docs.map((doc) => {
                  return bookings.push({
                    bookingId: doc.id,
                    listingId: tempDoc.id,
                    ...tempDoc,
                    ...doc.data(),
                  });
                })
              );
            }
          })
        );
        //   Promise.all(tempPromise);
        console.log(`Booking data :${bookings.length}`);
        return bookings;
      } catch (error) {}
    };
  
    getBookings = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const bookingRef = collection(db, "Booking");
          const q = query(
            bookingRef,
            where("owner", "==", auth.currentUser.email)
          );
          const querySnapshot = await getDocs(q);
          const bookings = [];
          querySnapshot.forEach((doc) =>
            bookings.push({
              id: doc.id,
              ...doc.data(),
            })
          );
          return bookings;
        } else {
          throw new Error("No user is logged in");
        }
      } catch (error) {
        console.error("Error fetching Bookings: ", error);
        return [];
      }
    };
  
    approveBooking = async (item, status) => {
      try {
        const r =
          status === "Approved"
            ? (Math.random() + 1).toString(36).substring(2)
            : "";
  
            const bookingRef = collection(db, "Booking");
            const docRef = doc(
              bookingRef,
              item.id
            );
      //   const coll = collection(db, "Listing/" + item.listingId + "/bookings");
      //   const docRef = doc(coll, item.bookingId);
  
        console.log({ r });
  
        item.status = status;
        item.confirmationCode = r;
        const collectionRef = collection(
          db,
          `Renter`,
          `${item.renter}`,
          "Receipts"
        );
        const querySnapshot = await addDoc(collectionRef, item);
        // const resultsFromDB = []
        // querySnapshot.forEach (eachDoc) => {
        // console. log('${JSON.stringify(eachDoc)}*)
  
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await setDoc(
            docRef,
            {
              status: status,
              confirmationCode: r,
            },
            { merge: true }
          ).then(() => {
            return {
              status: "success",
              code: r,
            };
          });
          return {
            status: "success",
            code: r,
          };
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {}
    };
  
    //add video to favorites
    addToFavorites = async (video) => {
      try {
        const docRef = await addDoc(collection(db, "favorites"), video);
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error("Error adding document: ", error);
        return { success: false, error };
      }
    };
  
    //get all favorite videos
    fetchFavorites = async () => {
      try {
        const favoritesRef = collection(db, "favorites");
        const querySnapshot = await getDocs(favoritesRef);
        const favorites = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return favorites;
      } catch (error) {
        console.error("Error fetching favorites:", error);
        throw new Error("Failed to fetch favorites");
      }
    };
  
    // Add listing to Firestore
    addListing = async (listingData) => {
      try {
        const docRef = await addDoc(collection(db, "Listing"), listingData);
        console.log("Listing added with ID: ", docRef.id);
        return { success: true, id: docRef.id };
      } catch (error) {
        console.error("Error adding listing: ", error);
        return { success: false, error };
      }
    };
  }
  
  export default FirestoreController;
  