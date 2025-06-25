
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Music, 
  Film, 
  Book, 
  Calendar,
  Star,
  Clock,
  TrendingUp,
  Heart,
  Share,
  Bookmark,
  Users
} from "lucide-react";

const Entertainment: React.FC = () => {
  return (
    <div className="container py-6">
      <Helmet>
        <title>LifeOS - Entertainment & Social</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Entertainment & Social</h1>
          <p className="text-muted-foreground">
            Discover, enjoy, and share your favorite content and experiences
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Music className="h-4 w-4 mr-2 text-green-500" />
                Music
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47 hrs</div>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Film className="h-4 w-4 mr-2 text-red-500" />
                Movies & Shows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23 hrs</div>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Book className="h-4 w-4 mr-2 text-blue-500" />
                Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 hrs</div>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Social Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations">For You</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="movies">Movies & TV</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Now</CardTitle>
                  <CardDescription>Popular content this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 border rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Midnight Memories</div>
                      <div className="text-sm text-muted-foreground">New Album - Arctic Monkeys</div>
                    </div>
                    <Badge>🔥 Hot</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-2 border rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Film className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Quantum Paradox</div>
                      <div className="text-sm text-muted-foreground">Sci-Fi Series - Episode 8</div>
                    </div>
                    <Badge>🚀 New</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-2 border rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Book className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Digital Minimalism</div>
                      <div className="text-sm text-muted-foreground">Cal Newport</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">4.6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Based on Your Taste</CardTitle>
                  <CardDescription>Personalized recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">Indie Rock Playlist</div>
                        <div className="text-sm text-muted-foreground">47 songs • 3h 12m</div>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Because you listened to Arctic Monkeys
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">The Crown Season 6</div>
                        <div className="text-sm text-muted-foreground">Historical Drama</div>
                      </div>
                      <Button size="sm">
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Similar to shows you've watched
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">Atomic Habits</div>
                        <div className="text-sm text-muted-foreground">James Clear</div>
                      </div>
                      <Button size="sm">
                        <Bookmark className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Recommended by similar readers
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Continue Watching</CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">Stranger Things</div>
                    <div className="text-sm text-muted-foreground mb-2">S4 E7 • 23 min left</div>
                    <Progress value={65} className="mb-2" />
                    <Button size="sm" className="w-full">
                      <Play className="h-3 w-3 mr-1" />
                      Continue
                    </Button>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">The Psychology of Money</div>
                    <div className="text-sm text-muted-foreground mb-2">Chapter 8 • 45% complete</div>
                    <Progress value={45} className="mb-2" />
                    <Button size="sm" className="w-full">
                      <Book className="h-3 w-3 mr-1" />
                      Continue Reading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="music" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Music</CardTitle>
                  <CardDescription>Recently played and favorites</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Currently Playing</div>
                      <div className="text-sm text-muted-foreground">Bohemian Rhapsody - Queen</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Recent Playlists</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 border rounded-lg text-center">
                        <div className="font-medium">Focus</div>
                        <div className="text-xs text-muted-foreground">34 songs</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="font-medium">Workout</div>
                        <div className="text-xs text-muted-foreground">28 songs</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="font-medium">Chill</div>
                        <div className="text-xs text-muted-foreground">41 songs</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="font-medium">Discover</div>
                        <div className="text-xs text-muted-foreground">50 songs</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Music Stats</CardTitle>
                  <CardDescription>Your listening patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">47 hours</div>
                    <div className="text-sm text-muted-foreground">Listened this month</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rock</span>
                        <span>35%</span>
                      </div>
                      <Progress value={35} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Electronic</span>
                        <span>28%</span>
                      </div>
                      <Progress value={28} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Jazz</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Classical</span>
                        <span>17%</span>
                      </div>
                      <Progress value={17} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="movies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Watchlist</CardTitle>
                  <CardDescription>Movies and shows to watch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Dune: Part Two</div>
                    <div className="text-sm text-muted-foreground">2024 • Sci-Fi</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">8.8</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">The Bear Season 3</div>
                    <div className="text-sm text-muted-foreground">2024 • Comedy Drama</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">9.1</span>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium">Oppenheimer</div>
                    <div className="text-sm text-muted-foreground">2023 • Biography</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">8.4</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">View All</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trending</CardTitle>
                  <CardDescription>Popular this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 border rounded-lg">
                    <Badge className="bg-red-500">1</Badge>
                    <div className="flex-1">
                      <div className="font-medium">Wednesday</div>
                      <div className="text-sm text-muted-foreground">Netflix Series</div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>

                  <div className="flex items-center space-x-3 p-2 border rounded-lg">
                    <Badge className="bg-orange-500">2</Badge>
                    <div className="flex-1">
                      <div className="font-medium">Avatar 2</div>
                      <div className="text-sm text-muted-foreground">Action/Adventure</div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>

                  <div className="flex items-center space-x-3 p-2 border rounded-lg">
                    <Badge className="bg-yellow-500">3</Badge>
                    <div className="flex-1">
                      <div className="font-medium">House of Dragon</div>
                      <div className="text-sm text-muted-foreground">HBO Series</div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                  <CardDescription>Viewing patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">23 hours</div>
                    <div className="text-sm text-muted-foreground">Watched this month</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Movies: 8</span>
                      <span>Shows: 12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg rating given:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span>4.2</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Currently Reading</CardTitle>
                  <CardDescription>Your active books</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold mb-1">The Psychology of Money</div>
                    <div className="text-sm text-muted-foreground mb-2">Morgan Housel</div>
                    <Progress value={68} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Chapter 12 of 18</span>
                      <span>68% complete</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="font-semibold mb-1">Atomic Habits</div>
                    <div className="text-sm text-muted-foreground mb-2">James Clear</div>
                    <Progress value={25} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Chapter 4 of 16</span>
                      <span>25% complete</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Book className="h-4 w-4 mr-2" />
                    Continue Reading
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reading Goals</CardTitle>
                  <CardDescription>Track your reading progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">18/24</div>
                    <div className="text-sm text-muted-foreground">Books this year</div>
                    <Progress value={75} className="mt-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Pages read this month</span>
                      <span className="font-semibold">847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Reading streak</span>
                      <span className="font-semibold">12 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg reading time</span>
                      <span className="font-semibold">32 min/day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Social activities and entertainment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">Jazz Night at Blue Note</div>
                        <div className="text-sm text-muted-foreground">Friday, 8:00 PM</div>
                      </div>
                      <Badge>Tonight</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>3 friends going</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">Art Gallery Opening</div>
                        <div className="text-sm text-muted-foreground">Saturday, 6:00 PM</div>
                      </div>
                      <Badge variant="outline">Interested</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>12 people interested</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">Book Club Meeting</div>
                        <div className="text-sm text-muted-foreground">Sunday, 3:00 PM</div>
                      </div>
                      <Badge>Going</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>8 members attending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Suggestions</CardTitle>
                  <CardDescription>Based on your interests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold mb-1">Indie Film Festival</div>
                    <div className="text-sm text-muted-foreground mb-2">Next weekend • Downtown Cinema</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">97% match</span>
                      </div>
                      <Button size="sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold mb-1">Tech Conference 2024</div>
                    <div className="text-sm text-muted-foreground mb-2">Next month • Convention Center</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">89% match</span>
                      </div>
                      <Button size="sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold mb-1">Local Food Festival</div>
                    <div className="text-sm text-muted-foreground mb-2">This weekend • City Park</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">78% match</span>
                      </div>
                      <Button size="sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Entertainment;
