"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { X, Eye, Trash2 } from "lucide-react"
import { useComparison } from "./comparison-context"
import { useRouter } from "next/navigation"

export function ComparisonFloatingBar() {
  const { items, removeFromComparison, clearComparison } = useComparison()
  const router = useRouter()

  if (items.length === 0) return null

  const handleViewComparison = () => {
    router.push("/compare")
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="p-4 shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Compare Universities:</span>
            <Badge variant="secondary">{items.length}/4</Badge>
          </div>

          <div className="flex items-center gap-2 max-w-md overflow-x-auto">
            {items.map((item) => (
              <div
                key={`${item.university.id}-${item.course.id}`}
                className="flex items-center gap-1 bg-muted rounded-md px-2 py-1 text-xs whitespace-nowrap"
              >
                <span className="truncate max-w-24">{item.university.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeFromComparison(item.university.id, item.course.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleViewComparison}>
              <Eye className="h-4 w-4 mr-2" />
              Compare
            </Button>
            <Button variant="outline" size="sm" onClick={clearComparison}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

