import styles from "./index.module.css";
import Head from "next/head";
import React from "react";
import LoginForm from "n/component/LoginForm";
import Form from "../component/Form";
import MVP from "../component/MVP/";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MVP />

      <main className={styles.main}>
        <LoginForm />
        <Form />
      </main>
    </>
  );
}
