import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Nigerian Cities Banner */}
      <div className="bg-green-600 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Serving Freelancers Across Nigeria
            </h3>
            <p className="text-green-100">
              From bustling cities to emerging tech hubs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu'].map((city) => (
              <div key={city} className="text-white hover:text-green-100 cursor-pointer">
                {city}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="font-bold text-xl">NaijaFreelance</span>
            </div>

            <p className="text-gray-400 mb-4">
              Nigeria's leading freelance marketplace connecting talented professionals with businesses across the country.
            </p>

            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For Freelancers</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                "Find Work",
                "How to Get Started",
                "Success Stories",
                "Payment Methods",
                "Freelancer Plus"
              ].map((item) => (
                <li key={item}>
                  <button className="hover:text-white text-left w-full">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="font-semibold text-lg mb-4">For Clients</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                "Post a Job",
                "Find Talent",
                "Enterprise Solutions",
                "Client Success",
                "Pricing"
              ].map((item) => (
                <li key={item}>
                  <button className="hover:text-white text-left w-full">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support & Legal</h4>
            <ul className="space-y-2 text-gray-400 mb-6">
              {[
                "Help Center",
                "Privacy Policy",
                "Terms of Service",
                "Safety Guidelines",
                "Community Standards"
              ].map((item) => (
                <li key={item}>
                  <button className="hover:text-white text-left w-full">
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                support@naijafreelance.com
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +234 817 115 2992
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Abuja, Nigeria
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="text-center mb-6">
            <h4 className="font-semibold text-lg mb-4">Secure Nigerian Payment Options</h4>

            <div className="flex justify-center items-center space-x-6 flex-wrap gap-4">
              {["Paystack", "Flutterwave", "GTBank", "First Bank", "Zenith Bank"].map((method) => (
                <div
                  key={method}
                  className="bg-white rounded-lg px-4 py-2 text-black font-semibold"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2024 NaijaFreelance. All rights reserved. Built with ❤️ in Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}
