import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function HeroSection() {
  return (
    <div className="bg-sky-50 px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="mb-4">
          Find the Best <span className="text-emerald-600">Nigerian Talent</span> for Your Projects
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with skilled freelancers across Nigeria. From Lagos to Abuja, find professionals ready to bring your ideas to life.
        </p>
        
        <Card className="max-w-md mx-auto mb-8">
          <CardContent className="p-6">
            <div className="flex gap-2 mb-4">
              <Input placeholder="What service are you looking for?" className="flex-1" />
              <Button className="bg-emerald-600 hover:bg-emerald-700">Search</Button>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground mr-2">Popular:</span>
              <Button variant="link" className="p-0 h-auto text-emerald-600 text-sm">Web Development</Button>
              <span className="mx-1">•</span>
              <Button variant="link" className="p-0 h-auto text-emerald-600 text-sm">Design</Button>
              <span className="mx-1">•</span>
              <Button variant="link" className="p-0 h-auto text-emerald-600 text-sm">Writing</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-semibold">50k+</div>
            <div className="text-muted-foreground text-sm">Active Freelancers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">100k+</div>
            <div className="text-muted-foreground text-sm">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">₦2.5B+</div>
            <div className="text-muted-foreground text-sm">Paid to Freelancers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
