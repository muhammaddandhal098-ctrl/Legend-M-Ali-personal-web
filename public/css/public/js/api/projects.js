let projectsList = [
  { id: 1, title: "Legend M Ali Monitor", category: "Android Kotlin", description: "Glassmorphic UI layout with foreground service and screen capture setup." },
  { id: 2, title: "ESP32 Hardware Automation", category: "ESP32", description: "Custom Wi-Fi web controller and serial monitoring via Arduino IDE." }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    return res.status(200).json(projectsList);
  } else if (req.method === 'POST') {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: "All fields required" });
    }
    const newProject = { id: Date.now(), title, category, description };
    projectsList.unshift(newProject);
    return res.status(201).json(newProject);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
