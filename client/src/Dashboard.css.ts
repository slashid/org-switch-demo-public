import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  placeItems: "center",
  width: "100%",
  height: "100%"
});

export const content = style({
  width: "465px"
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  marginTop: "40px"
})

export const button = style({
  marginTop: "8px",
  padding: "4px"
})