const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Conversation history (keeps context across turns)
const messages = [
  {
    role: "system",
    content: `You are a helpful L'Oréal beauty advisor. You only answer questions 
    related to L'Oréal products, skincare routines, haircare, makeup, and beauty 
    recommendations. If someone asks about anything unrelated to L'Oréal or beauty 
    topics, politely let them know you can only assist with L'Oréal beauty questions 
    and redirect them. Be warm, knowledgeable, and encouraging.`
  }
];

// Display initial greeting
appendMessage("ai", "👋 Hi! I'm your L'Oréal beauty advisor. Ask me about skincare routines, product recommendations, or anything L'Oréal!");

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add("msg", role);
  div.textContent = (role === "user" ? "You: " : "Advisor: ") + text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  // Show user message
  appendMessage("user", text);
  messages.push({ role: "user", content: text });
  userInput.value = "";

  // Show loading indicator
  appendMessage("ai", "Thinking...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 300
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Remove "Thinking..." and show real reply
    chatWindow.removeChild(chatWindow.lastChild);
    messages.push({ role: "assistant", content: reply });
    appendMessage("ai", reply);

  } catch (err) {
    chatWindow.removeChild(chatWindow.lastChild);
    appendMessage("ai", "Sorry, something went wrong. Please try again.");
    console.error(err);
  }
});
