import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from '../components/Breadcrumb'
import { IoIosAdd } from "react-icons/io";
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'






const ManageDepartments = () => {
    interface Product {
        id: any
        Name: string;

    }
    let emptyProduct: Product = {
        id: null,
        Name: ''

    };
    const { addDepartment, departments, getDepartments, deleteDepartment, updateDepartment } = useAuth()
    const toastCenter = useRef<Toast>(null);
    const [rows, setRows] = useState<Department[]>([])
    const [submitted, setSubmitted] = useState(false)
    const [productDialog, setProductDialog] = useState(false)
    const [productDialogUpdate, setProductDialogUpdate] = useState(false)
    const [product, setProduct] = useState<Product>(emptyProduct)
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);


    interface Department {
        id: number
        Name: string
        Members: number

    }

    const showSuccess = (mess: string) => {
        toastCenter.current?.show({
            severity: "success",
            summary: "Success",
            detail: mess,
            life: 2000,
        });
    };

    const showError = (error: string) => {
        toastCenter.current?.show({
            severity: "error",
            summary: "Error",
            detail: error,
            life: 2000,
        });
    };
    useEffect(() => { getDepartments() }, [])

    useEffect(() => {
        const array: Department[] = []

        departments?.map((d: any) => {
            const obj: Department = {
                id: d._id,
                Name: d.name,
                Members: 0
            }
            array.push(obj)
        })
        setRows(array)

    }, [departments])

    const handleAdd = () => {
        setProduct(emptyProduct)
        setProductDialog(true)
    }

    const handleCreateSubmit = (e: { preventDefault: () => void }) => {
        setSubmitted(true)
        e.preventDefault()



        addDepartment({ name: product.Name }).then(() => {
            showSuccess('Department Created Successfully!')
            setProduct(emptyProduct)
            setProductDialog(false)
        }).catch((error) => {
            console.log(error.toString());
            showError(error.toString())

        })


    }
    const handleUpdateSubmit = () => {


        updateDepartment(product.id, {

            name: product?.Name
        }).then(() => {
            showSuccess("department Updated Successfully!");
            getDepartments()
            hideDialog()

        })
            .catch((error) => {
                console.log(error);
                showError(error.toString())

            });
    }

    const handleDeleteDepartment = (e: any, id: number) => {
        e.preventDefault()
        deleteDepartment(id).then(() => {

            getDepartments()
            const filtered = departments?.filter((dep: any) => (
                dep?._id !== id
            ))
            const array: Department[] = []
            filtered.map((filter: any) => {
                const obj = {
                    id: filter._id,
                    Name: filter.name,
                    Members: 0
                }
                array.push(obj)
            })
            setRows(array)
            setDeleteProductDialog(false)
            showSuccess(product.Name.toUpperCase() + ' has successfully been deleted!')
        }).catch((error) => {
            showError(error.toString())
        })
    }

    const handleEditDepartment = (e: any, rowData: any) => {
        e.preventDefault()
        setProductDialogUpdate(true)
        console.log(rowData);
        
        setProduct({
            id: rowData?.id,
            Name: rowData?.Name
        })


    }
    const confirmDeleteProduct = (rowData: any) => {
        setProduct(rowData);
        setDeleteProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setProductDialogUpdate(false)
    };

    const InputChange = (e: React.ChangeEvent<HTMLInputElement>, id: any) => {
        e.preventDefault()
        const val = e.target.value

        setProduct({
            id: id,
            Name: val
        })
    }
    const hideDeleteProductsDialog = () => {
        setDeleteProductDialog(false);
    };
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" className='border rounded-lg border-sky-500 text-sky-500 p-2' icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label='Submit' className='border rounded-lg bg-sky-500 text-white p-2 ml-2' severity='success' icon="pi pi-check" onClick={(e) => handleCreateSubmit(e)} />
        </React.Fragment>
    );
    const productDialogFooter1 = (
        <React.Fragment>
            <Button label="Cancel" className='border rounded-lg border-sky-500 text-sky-500 p-2' icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label='Submit' className='border rounded-lg bg-sky-500 text-white p-2 ml-2' icon="pi pi-check" onClick={() => handleUpdateSubmit()} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className='border rounded-lg border-sky-500 text-sky-500 p-2' outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className='border rounded-lg bg-red-500 text-white py-2 px-3 ml-2' severity="danger" onClick={(e) => handleDeleteDepartment(e, product.id)} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className='border rounded-full border-sky-500 text-sky-500' rounded aria-label='Filter' onClick={(e) => handleEditDepartment(e, rowData)} />
                <Button icon="pi pi-trash" className='border rounder-full border-amber-900 text-amber-900 ml-2' rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    return (
        <>
            <Breadcrumb pageName='Manage Departments' />

            <Toast ref={toastCenter} position='top-center' />
            <div className="">
                <div className=""  >
                    <div onClick={() => handleAdd()} className="flex justify-start items-center p-5 gap-3 rounded-lg border border-sky-500 text-sky-500 text-lg w-[250px] mb-10  cursor-pointer">
                        <span className=''><IoIosAdd className='h-8 w-8 text-sky-500' /></span>
                        <button className=''>Add Departments</button>
                    </div>
                </div>

                <div className="card">
                    {rows && (

                        <DataTable value={rows} tableStyle={{ minWidth: "50rem" }} showGridlines>
                            <Column field="Name" header="Name" ></Column>
                            <Column field="Members" header="Members " ></Column>
                            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

                        </DataTable>)
                    }
                </div>

                <Dialog header='Create Department' headerClassName='text-lg font-bold' style={{ width: '28rem' }} footer={productDialogFooter} visible={productDialog} onHide={hideDialog} className=''>
                    <div className="field flex flex-col justify-start items-start gap-3 mt-5" >
                        <label className=" font-bold text-sm">
                            Department Name
                        </label>
                        <InputText variant='filled' className="border border-stroke w-full p-2 focus:border-sky-300 hover:cursor-auto" placeholder='Enter Department Name' value={product.Name} onChange={(e) => { InputChange(e, product.id) }} required ></InputText>
                        {submitted && product.Name === null ? <small className="p-error">Name is required.</small> : ''}

                    </div>




                </Dialog>
                <Dialog header='Edit Department' headerClassName='text-lg font-bold' style={{ width: '28rem' }} footer={productDialogFooter1} visible={productDialogUpdate} onHide={hideDialog} className=''>
                    <div className="field flex flex-col justify-start items-start gap-3 mt-5" >
                        <label className=" font-bold text-sm">
                            Department Name
                        </label>
                        <InputText className="border border-stroke w-full  p-2" value={product.Name} onChange={(e) => { InputChange(e, product.id) }}></InputText>

                    </div>




                </Dialog>

                <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductsDialog}>
                    <div className="confirmation-content flex items-end justify-start">
                        <i className="pi pi-exclamation-triangle mr-3 text-amber-900 " style={{ fontSize: '2rem' }} />
                        {product && (
                            <span>
                                Are you sure you want to delete <b>{product.Name}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div >

        </>
    )
}

export default ManageDepartments