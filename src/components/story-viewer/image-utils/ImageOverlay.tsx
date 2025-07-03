
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageStatusDisplay } from './imageStatusHelper';
import ImageDebugInfo from './ImageDebugInfo';

interface ImageOverlayProps {
    status: ImageStatusDisplay;
    onRetry: () => void;
    showDebugInfo?: boolean;
    imageGenerationStatus?: string;
    imageUrl?: string;
    isRealImageUrl?: boolean;
    urlContainsSupabase?: boolean;
    urlContainsStorage?: boolean;
    urlStartsWithHttp?: boolean;
    imageLoaded?: boolean;
    imageError?: boolean;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
    status,
    onRetry,
    showDebugInfo = false,
    imageGenerationStatus,
    imageUrl,
    isRealImageUrl,
    urlContainsSupabase,
    urlContainsStorage,
    urlStartsWithHttp,
    imageLoaded,
    imageError
}) => {
    const IconComponent = status.icon;

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/95 backdrop-blur-sm">
            <div className="text-center space-y-3">
                <IconComponent className={`h-8 w-8 text-primary mx-auto ${status.spinning ? 'animate-spin' : ''}`} />
                <div>
                    <p className="text-sm font-medium text-foreground">
                        {status.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {status.subtext}
                    </p>
                </div>
                {status.showRetry && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRetry}
                        className="mt-2"
                    >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                    </Button>
                )}
            </div>
            
            {/* Debug info in development */}
            {(process.env.NODE_ENV === 'development' || showDebugInfo) && (
                <ImageDebugInfo
                    imageGenerationStatus={imageGenerationStatus}
                    imageUrl={imageUrl}
                    isRealImageUrl={isRealImageUrl}
                    urlContainsSupabase={urlContainsSupabase}
                    urlContainsStorage={urlContainsStorage}
                    urlStartsWithHttp={urlStartsWithHttp}
                    imageLoaded={imageLoaded}
                    imageError={imageError}
                />
            )}
        </div>
    );
};

export default ImageOverlay;
