module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      staticDistDir: "./build/client/",
      url: ["https://whatsapp-mern-web.onrender.com/"],
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        interactive: ["error", { maxNumericValue: 200 }],
        // You can add more assertions as needed
      },
    },
  },
};

//
/*
To run this file use
 lhci autorun (for .cjs file extension)

*/
