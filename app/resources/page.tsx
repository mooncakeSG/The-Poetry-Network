const RESOURCES: ResourceSection[] = [
  {
    category: "Crisis Support",
    items: [
      {
        title: "National Suicide Prevention Lifeline",
        phone: "988",
        description: "24/7 free and confidential support"
      },
      {
        title: "Crisis Text Line",
        text: "HOME to 741741",
        description: "Free 24/7 crisis counseling via SMS"
      }
    ]
  },
  {
    category: "Self-Care Tools",
    items: [
      {
        title: "Breathing Exercises",
        link: "/breathing",
        description: "Guided anxiety-reduction techniques"
      },
      {
        title: "Mindfulness Journal",
        link: "/journal",
        description: "Daily reflection prompts"
      }
    ]
  }
];

interface Resource {
  title: string;
  description: string;
  phone?: string;
  text?: string;
  link?: string;
}

interface ResourceSection {
  category: string;
  items: Resource[];
}

export default function MentalHealthResources() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Mental Health Resources</h1>
      
      {RESOURCES.map((section) => (
        <section key={section.category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{section.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.items.map((resource) => (
              <div 
                key={resource.title} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="space-y-2">
                  {resource.phone && (
                    <a 
                      href={`tel:${resource.phone}`} 
                      className="block text-indigo-600 hover:text-indigo-800"
                    >
                      Call {resource.phone}
                    </a>
                  )}
                  {resource.text && (
                    <a 
                      href={`sms:${resource.text}`} 
                      className="block text-indigo-600 hover:text-indigo-800"
                    >
                      Text {resource.text}
                    </a>
                  )}
                  {resource.link && (
                    <a 
                      href={resource.link} 
                      className="block text-indigo-600 hover:text-indigo-800"
                    >
                      Get Started →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
} 