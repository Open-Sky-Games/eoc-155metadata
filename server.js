const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static("."));

// Set proper MIME type for JSON files
app.use("/tokens", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Handle root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle collection metadata
app.get("/collection.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "collection.json"));
});

// Handle individual token metadata
app.get("/tokens/:tokenId", (req, res) => {
  let tokenId = req.params.tokenId;

  // Remove .json extension if present
  if (tokenId.endsWith(".json")) {
    tokenId = tokenId.slice(0, -5); // Remove '.json' (5 characters)
  }

  // Check if the tokenId is a long hexadecimal string (64 characters)
  // This is common for ERC-721 token IDs that are uint256 values
  if (tokenId.length === 64 && /^[0-9a-fA-F]+$/.test(tokenId)) {
    // Convert hex string to decimal
    tokenId = parseInt(tokenId, 16).toString();
    console.log(`Converted hex token ID to decimal: ${tokenId}`);
  }

  const filePath = path.join(__dirname, "tokens", `${tokenId}.json`);

  res.setHeader("Content-Type", "application/json");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving token ${tokenId}:`, err);
      res.status(404).json({ error: "Token not found" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving metadata for Echoes of Cryptalia`);
});
