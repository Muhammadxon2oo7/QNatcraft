'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

// Ma'lumotlar (mock data)
const initialData = [
  { date: '17.02', value: 100 },
  { date: '18.02', value: 150 },
  { date: '19.02', value: 50 },
  { date: '20.02', value: 175 },
  { date: '21.02', value: 125 },
  { date: '22.02', value: 75 },
  { date: '23.02', value: 100 },
];

const StatsComponent: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [viewMode, setViewMode] = useState<'tushum' | 'sotilgan'>('tushum');

  // Maksimal qiymatni topish (grafik uchun)
  const maxValue = Math.max(...data.map((item) => item.value));

  // Kalendar orqali sana tanlash
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    // Bu yerda API chaqiruvi yoki ma'lumotlarni yangilash logikasi bo'lishi mumkin
  };

  // Tugma bosilganda ko'rinishni o'zgartirish
  const handleViewChange = (mode: 'tushum' | 'sotilgan') => {
    setViewMode(mode);
    // Ma'lumotlarni yangilash logikasi (masalan, API chaqiruvi)
    if (mode === 'sotilgan') {
      setData(initialData); // Mock ma'lumotlar
    } else {
      setData(initialData); // Mock ma'lumotlar
    }
  };

  return (
    <div className="p-4">
      {/* Sarlavha */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Statistikalar</h2>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'tushum' ? 'default' : 'outline'}
            className={
              viewMode === 'tushum'
                ? 'bg-red-800 text-white'
                : 'text-gray-500 border-gray-300'
            }
            onClick={() => handleViewChange('tushum')}
          >
            Tushumlar bo‘yicha
          </Button>
          <Button
            variant={viewMode === 'sotilgan' ? 'default' : 'outline'}
            className={
              viewMode === 'sotilgan'
                ? 'bg-red-800 text-white'
                : 'text-gray-500 border-gray-300'
            }
            onClick={() => handleViewChange('sotilgan')}
          >
            Sotilganlar bo‘yicha
          </Button>
        </div>
      </div>

      {/* Sana va kalendar */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-gray-500">
          {viewMode === 'tushum'
            ? '17-23 – fevral haftasida tushgan pullar (mln so‘mda)'
            : '17-23 – fevral haftasida sotilgan mahsulotlar (donada)'}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-red-800">
              <CalendarIcon className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              locale={uz}
              className="rounded-md border"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grafik va statistika */}
      <div className="flex space-x-4">
        {/* Grafik qismi */}
        <div className="flex-1">
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end space-x-2">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex-1 bg-green-500 rounded-t-lg"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                  }}
                >
                  <span className="text-center text-xs text-gray-500 block mt-2">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
            {/* Y o'qi chiziqlari */}
            <div className="absolute inset-0">
              {[0, 50, 100, 150, 200].map((value) => (
                <div
                  key={value}
                  className="absolute w-full border-t border-gray-200"
                  style={{ bottom: `${(value / 200) * 100}%` }}
                >
                  <span className="absolute -left-8 text-gray-500 text-sm">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Umumiy statistika qismi */}
        <div className="w-64 space-y-4">
          {viewMode === 'tushum' ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>233 mln 500 ming</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Joriy davr mobaynidagi tushum
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>245 mlrd 233 mln 500 ming</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Jami tushum</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>657 dona</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Joriy davr mobaynidagi sotilgan mahsulotlar
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>1876 dona</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Jami sotilgan mahsulotlar
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsComponent;