import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, X, Check } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelUploadProps {
  onQuestionsLoaded: (questions: string[]) => void;
  onClear: () => void;
  questionCount?: number;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ 
  onQuestionsLoaded, 
  onClear, 
  questionCount = 0 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const processExcelFile = useCallback((file: File) => {
    setIsProcessing(true);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        // Extract questions (skip empty rows)
        const questions: string[] = [];
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row[0] && typeof row[0] === 'string') {
            const question = row[0].trim();
            // Skip headers
            if (question.toLowerCase() !== 'question' && question.toLowerCase() !== 'questions') {
              if (question.length > 5) { // Basic validation
                questions.push(question);
              }
            }
          }
        }
        
        if (questions.length === 0) {
          setError('No valid questions found in the Excel file. Make sure questions are in column A.');
          setUploadStatus('error');
        } else if (questions.length < 4) {
          setError('At least 4 questions are required for the wheel.');
          setUploadStatus('error');
        } else if (questions.length > 12) {
          setError('Maximum 12 questions allowed. Only the first 12 will be used.');
          onQuestionsLoaded(questions.slice(0, 12));
          setUploadStatus('success');
        } else {
          onQuestionsLoaded(questions);
          setUploadStatus('success');
        }
        
      } catch (err) {
        setError('Failed to read Excel file. Please ensure it\'s a valid .xlsx or .xls file.');
        setUploadStatus('error');
      }
      setIsProcessing(false);
    };
    
    reader.onerror = () => {
      setError('Failed to read file.');
      setUploadStatus('error');
      setIsProcessing(false);
    };
    
    reader.readAsArrayBuffer(file);
  }, [onQuestionsLoaded]);

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    
    const isValidType = validTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith(type)
    );
    
    if (!isValidType) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      setUploadStatus('error');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Please select a file under 5MB.');
      setUploadStatus('error');
      return;
    }
    
    processExcelFile(file);
  }, [processExcelFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClear = () => {
    setError('');
    setUploadStatus('idle');
    onClear();
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted border-2 border-dashed border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Custom Questions</h3>
          </div>
          {questionCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {questionCount} questions loaded
              </span>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {uploadStatus === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragging ? 'Drop your Excel file here' : 'Upload Excel file with questions'}
              </p>
              <p className="text-sm text-muted-foreground">
                Questions should be in column A. Supports .xlsx and .xls files.
              </p>
              <p className="text-xs text-muted-foreground">
                4-12 questions required • Max file size: 5MB
              </p>
            </div>
            <div className="mt-4">
              <label htmlFor="excel-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </label>
              <Input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully loaded {questionCount} custom questions for your wheel!
            </AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <Alert>
            <FileSpreadsheet className="w-4 h-4 animate-pulse" />
            <AlertDescription>
              Processing Excel file... Please wait.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <X className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};