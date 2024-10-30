"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { CircularProgress, Box } from "@mui/material";

const LanguageDropdown = ({ onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingLanguages(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ai/model`,
        {
          params: {
            model_name: "mms-1b-all",
            skip: 0,
            limit: 1,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ApiToken}`,
          },
        }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setLanguages(response.data[0].languages);
      } else {
        setLanguages([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLanguages([]);
    } finally {
      setLoadingLanguages(false);
    }
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
    onLanguageChange(selectedOption.value);
  };

  const options = languages.map((language) => ({
    value: language.lang_code,
    label: language.lang_name,
  }));

  return (
    <Box sx={{ width: "210px", position: "relative" }}>
      <Select
        options={options}
        value={selectedLanguage}
        onChange={handleLanguageChange}
        placeholder={
          loadingLanguages ? (
            <span style={{ display: "flex", alignItems: "center", fontSize: "18px" }}>
              <CircularProgress size={18} sx={{ marginRight: '8px' }} /> 
              Loading ...
            </span>
          ) : (
            <span style={{ fontSize: "18px" }}>Select Language</span>
          )
        }
        isDisabled={!languages.length}
        styles={{
          container: (base) => ({
            ...base,
            padding: "5px",
            borderRadius: "5px",
          }),
          control: (base) => ({
            ...base,
            backgroundColor: "#333",
            border: 'none',
            borderRadius: "5px",
            boxShadow: 'none',
            '&:hover': {
              borderColor: 'transparent',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: "white",
            fontSize: "18px",
          }),
          placeholder: (base) => ({
            ...base,
            color: "white",
            fontSize: "18px",
          }),
          input: (base) => ({
            ...base,
            color: "white",
            fontSize: "18px",
          }),
          option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? "#444" : "#333",
            color: "white",
            fontSize: "18px",
            '&:hover': {
              backgroundColor: "#444",
            },
          }),
        }}
      />
    </Box>
  );
};

export default LanguageDropdown;
