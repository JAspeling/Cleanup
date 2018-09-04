import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DirectoryRequest, DirectoriesRequest } from "../classes/requests/validate-directory-request";
import { DirectoryResponse } from '../classes/responses/directory-response';

@Injectable()
export class ApiService {
    api: string = '';
    route: string = '';

    constructor(private http: HttpClient) {

    }

    readAppSettings(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get('assets/appsettings.json').subscribe((res: any) => {
                this.api = res.api;
                this.route = res.route;
                resolve();
            }, err => reject(err));
        });
    }

    validateDirectory(directory: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.post<boolean>(`${this.api}${this.route}/api/Directory/Validate`, new DirectoryRequest({ path: directory }))
                .subscribe((res) => resolve(res), err => {
                    reject(err);
                });
        });
    }

    analyzeDirectory(directory: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post<DirectoryResponse>(`${this.api}${this.route}/api/Directory/Analyze`, new DirectoryRequest({ path: directory }))
                .subscribe(res => { resolve(res); }, err => reject(err));
        });
    }

    deleteDirectory(directory: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post<DirectoryResponse>(`${this.api}${this.route}/api/Directory/Delete`, new DirectoryRequest({ path: directory }))
                .subscribe(res => { resolve(res); }, err => reject(err));
        });
    }

    deleteDirectories(directories: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post<DirectoriesRequest>(`${this.api}${this.route}/api/Directory/DeleteMultiple`, new DirectoriesRequest({ paths: directories }))
                .subscribe(res => { resolve(res); }, err => reject(err));
        });
    }
}