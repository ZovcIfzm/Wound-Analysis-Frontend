const styles = {
  row: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    textAlign: "center",
  },
  areasColumn: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    width: "20%",
    alignItems: "center",
  },
  thinButton: {
    margin: 5,
  },
  cropperContainer: {
    width: 50,
    height: 50,
  },
  borderedContainer: {
    display: "flex",
    flex: 1,
    border: "1px black solid",
    padding: 15,
  },
  container: {
    display: "flex",
    flex: 1,
    padding: 15,
    marginRight: "auto",
    marginLeft: "auto",
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
  },
  boxShadow: {
    boxShadow:
      "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
  },
  centeredText: {
    alignSelf: "center",
  },
  title: {
    color: "#3C4858",
    margin: "1.75rem 0 0.875rem",
    textDecoration: "none",
    fontWeight: "700",
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    marginTop: "0",
    minHeight: "32px",
  },

  main: {
    display: "flex",
    flex: 1,
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3",
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
  },

  mainRaised: {
    margin: "0px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
  },

  images: {
    display: "flex",
    flex: 1,
    width: "70%",
    height: "70%",
    alignSelf: "center",
  },
  gridImage: {
    display: "flex",
    flex: 1,
    width: "33%",
    alignSelf: "center",
  },

  cropButton: {
    display: "flex",
    flex: 1,
    width: "50%",
    alignSelf: "center",
  },
  hsvButton: {
    display: "flex",
    flex: 1,
    alignSelf: "center",
  },
};

export default styles;
