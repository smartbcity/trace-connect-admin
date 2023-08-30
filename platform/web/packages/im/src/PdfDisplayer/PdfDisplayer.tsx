import {Box} from "@mui/material";
import {Document, Page, pdfjs} from "react-pdf";
import {useCallback, useEffect, useState} from "react";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { useElementSize } from "@mantine/hooks";
import { LoadingPdf } from "./LoadingPdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

interface PdfDisplayerProps {
    file?: string,
}

export const PdfDisplayer = (props: PdfDisplayerProps) => {
    const { file } = props

    const { ref, width } = useElementSize()
    const [isLoading, setIsLoading] = useState(true);
    const [numPages, setNumPages] = useState(0)

    useEffect(() => {
        setIsLoading(false);
    }, [file]);

    const onPdfLoaded = useCallback(({numPages} : {numPages: number}) => {
        setNumPages(numPages)
    }, [])
    return (
        <Box
            ref={ref}
            bgcolor="#F0EDE6"
            flexGrow={1}
            flexBasis={0}
            sx={{
                padding: (theme) => theme.spacing(1.5),
                width: "100%",
                height: "100%",
                overflow: "auto",
                "& .pdfPage": {
                    marginBottom: "16px",
                },
                "& .mui-utz8u3": {
                    margin: "0"
                }
            }}
        >

            { isLoading ? (
                <LoadingPdf parentWidth={width} />
            ) : (
                    file ? (
                        <Document
                            file={file}
                            onLoadSuccess={onPdfLoaded}
                        >
                            {
                                Array.from({length: numPages}, (_, pageNumber) => (
                                    <Page
                                        pageNumber={pageNumber + 1}
                                        key={`page_${pageNumber + 1}`}
                                        className="pdfPage"
                                        width={width}
                                        loading={<LoadingPdf parentWidth={width} />}
                                    />
                                ))
                            }
                            
                        </Document>
                    ) : (
                        <LoadingPdf parentWidth={width} />
                    )
            )}
        </Box>
    )
}
