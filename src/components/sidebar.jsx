import { Search } from './search'
import SurahSelector from './surah-selector'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import {
  Sheet,
  SheetContent,
} from './ui/sheet'

const Sidebar = ({
  isOpen,
  onClose,
  fatihaActive,
  setFatihaActive,
  setPageNumber,
  setHighlightedVerse
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[90%] sm:w-[400px] overflow-y-auto" dir="rtl">

        <div className="mt-6 space-y-8">

          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <Search
                setPageNumber={(page) => {
                  setPageNumber(page)
                  onClose()
                }}
                setHighlightedVerse={setHighlightedVerse}
              />
              <SurahSelector
                setPageNumber={(page) => {
                  setPageNumber(page)
                  onClose()
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="fatiha-toggle"
                checked={fatihaActive}
                onCheckedChange={(checked) => setFatihaActive(checked)}
                className="h-4 w-4"
              />
              <label
                htmlFor="fatiha-toggle"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                تفعيل ايات الفاتحة
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="https://drive.google.com/file/d/1yBEwe5uSxYJPz8f1WKoZu1LcLldEGTX0/view"
              className="block"
            >
              <Button className="w-full">تحميل PDF</Button>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Sidebar
