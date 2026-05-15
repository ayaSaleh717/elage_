import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Download, Calendar, Eye, Trash2 } from "lucide-react";

interface MedicalRecord {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

const Records = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: "1",
      name: "تحليل دم شامل.pdf",
      type: "PDF",
      uploadDate: "2024-03-15",
      size: "2.5 MB"
    },
    {
      id: "2", 
      name: "أشعة X-ray الصدر.jpg",
      type: "JPG",
      uploadDate: "2024-03-10",
      size: "1.8 MB"
    },
    {
      id: "3",
      name: "تقرير طبي عام.docx",
      type: "DOCX", 
      uploadDate: "2024-03-05",
      size: "856 KB"
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newRecords: MedicalRecord[] = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      }));
      
      setRecords(prev => [...newRecords, ...prev]);
      setIsUploading(false);
      setDragActive(false);
    }, 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'doc':
      case 'docx':
        return '📝';
      default:
        return '📎';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع السجلات الطبية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              {isUploading ? 'جاري الرفع...' : 'اسحب وأفلت الملفات هنا'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              أو انقر لاختيار الملفات من جهازك
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <Button 
              asChild 
              variant="outline"
              disabled={isUploading}
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                {isUploading ? 'جاري الرفع...' : 'اختيار الملفات'}
              </label>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            الصيغ المسموح بها: PDF, JPG, PNG, DOC, DOCX (الحد الأقصى: 10MB للملف)
          </p>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <FileText className="w-5 h-5" />
            السجلات الطبية المحفوظة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد سجلات طبية</h3>
              <p className="text-muted-foreground">
                ابدأ برفع سجلاتك الطبية لتظهر هنا
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="text-xl sm:text-2xl flex-shrink-0">
                      {getFileIcon(record.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground truncate">
                        {record.name}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {record.uploadDate}
                        </span>
                        <span>{record.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Records;