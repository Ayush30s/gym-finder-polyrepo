import React, { createContext, useContext, useState } from "react";

type LoaderContextType = {
  loading: boolean;
  text: string;
  showLoader: (msg?: string) => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Loading...");

  const showLoader = (msg?: string) => {
    if (msg) setText(msg);
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ loading, text, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error("useLoader must be used inside LoaderProvider");
  return context;
};
