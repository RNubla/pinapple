import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import firebase from "../firebase/clientApp";
import React from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import SignInScreen from "../component/Auth";

export default function Home() {
  // Firestore
  const db = firebase.firestore();
  // Deconstruct the auth state, loading and error out of the hook
  const [user, loading, error] = useAuthState(firebase.auth());
  console.log("Loading", loading, "|", "Current User:", user);

  const [votes, votesLoading, votesError] = useCollection(
    firebase.firestore().collection("votes"),
    {}
  );

  if (!votesLoading && votes) {
    votes.docs.map((doc) => {
      console.log(doc.data());
    });
  }

  const addVoteDocument = async (vote: string) => {
    await db.collection("votes").doc(user.uid).set({
      vote,
    });
  };
  const logout = () => {
    firebase.auth().signOut();
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gridGap: 8,
        background:
          "linear-gradient(180deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
      }}
    >
      {loading && <h4>Loading...</h4>}
      {!user && <SignInScreen />}
      {user && (
        <>
          <h1>Pineapple on Pizza?</h1>

          <div style={{ flexDirection: "row", display: "flex" }}>
            <button
              style={{ fontSize: 32, marginRight: 8 }}
              onClick={() => addVoteDocument("yes")}
            >
              ✔️🍍🍕
            </button>
            <h3>
              Pineapple Lovers:{" "}
              {votes?.docs?.filter((doc) => doc.data().vote === "yes").length}
            </h3>
          </div>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <button
              style={{ fontSize: 32, marginRight: 8 }}
              onClick={() => addVoteDocument("no")}
            >
              ❌🍍🍕
            </button>
            <h3>
              Pineapple Haters:{" "}
              {votes?.docs?.filter((doc) => doc.data().vote === "no").length}
            </h3>
          </div>
          <div>
            <button onClick={() => logout()}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
}
