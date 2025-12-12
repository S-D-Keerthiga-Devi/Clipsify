"use client"
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I upload videos and images on the platform?",
      answer:
        "You can upload videos and images from the unified upload page. Choose your file or drag and drop it directly into the uploader. Both video and image files are supported."
    },
    {
      question: "Which file formats are supported for upload?",
      answer:
        "We support common video formats like MP4, MOV, and WebM along with image formats such as JPG, PNG, and GIF. Ensure your files follow standard encoding for smooth upload."
    },
    {
      question: "Where can I view my uploaded videos?",
      answer:
        "All your uploaded videos appear in the Video Gallery section. You can browse, preview, and manage them from there."
    },
    {
      question: "Where can I find my uploaded images?",
      answer:
        "Uploaded images are displayed in the Image Gallery. This section organizes your images in a clean, grid-based layout."
    },
    {
      question: "Can I preview my videos or images after uploading?",
      answer:
        "Yes, you can preview both videos and images in their respective galleries to ensure everything looks correct after upload."
    }
  ];
  

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative w-screen py-16 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about Clipsify.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors"
              >
                <h3 className="text-base font-semibold text-white pr-8 group-hover:text-purple-300 transition-colors">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4">
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-gray-400 leading-relaxed mt-2 text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq